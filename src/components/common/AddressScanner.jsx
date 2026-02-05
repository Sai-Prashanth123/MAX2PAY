import { useState, useRef } from 'react';
import { Upload, Camera, FileText, X, Loader } from 'lucide-react';
import Tesseract from 'tesseract.js';
import Button from './Button';
import toast from 'react-hot-toast';

const AddressScanner = ({ onAddressExtracted, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const extractAddressFromText = (text) => {
    // Advanced normalization: fix common OCR errors
    const normalizedText = text
      .replace(/[|]/g, 'I')  // | → I
      .replace(/[l1]/g, (match, offset) => {
        // Context-aware l/1 correction
        const before = text[offset - 1] || '';
        const after = text[offset + 1] || '';
        if (/[a-z]/i.test(before) || /[a-z]/i.test(after)) return 'l';
        if (/\d/.test(before) || /\d/.test(after)) return '1';
        return match;
      })
      .replace(/[O0]/g, (match, offset) => {
        // Context-aware O/0 correction
        const before = text[offset - 1] || '';
        const after = text[offset + 1] || '';
        if (/[a-z]/i.test(before) || /[a-z]/i.test(after)) return 'O';
        if (/\d/.test(before) || /\d/.test(after)) return '0';
        return match;
      })
      .replace(/[S5]/g, (match, offset) => {
        const before = text[offset - 1] || '';
        const after = text[offset + 1] || '';
        if (/[a-z]/i.test(before) || /[a-z]/i.test(after)) return 'S';
        if (/\d/.test(before) || /\d/.test(after)) return '5';
        return match;
      })
      .replace(/[B8]/g, (match, offset) => {
        const before = text[offset - 1] || '';
        const after = text[offset + 1] || '';
        if (/[a-z]/i.test(before) || /[a-z]/i.test(after)) return 'B';
        if (/\d/.test(before) || /\d/.test(after)) return '8';
        return match;
      })
      .replace(/\s+/g, ' ')
      .trim();
    
    const lines = normalizedText.split('\n').filter(line => line.trim());
    
    // Enhanced patterns for address extraction
    const phoneRegex = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g;
    const zipRegex = /\b\d{5}(-\d{4})?\b/g;
    const stateRegex = /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/gi;
    
    const address = {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    };

    // State abbreviation mapping for full names to abbreviations
    const stateMap = {
      'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
      'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
      'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
      'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
      'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
      'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
      'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
      'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
      'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
      'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
      'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
      'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
      'wisconsin': 'WI', 'wyoming': 'WY'
    };

    // Extract phone number (try multiple matches)
    const phoneMatches = normalizedText.match(phoneRegex);
    if (phoneMatches && phoneMatches.length > 0) {
      // Get the first valid phone number
      for (const match of phoneMatches) {
        const digits = match.replace(/\D/g, '');
        if (digits.length >= 10) {
          const phone = digits.slice(-10);
          address.phone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
          break;
        }
      }
    }

    // Extract zip code
    const zipMatches = normalizedText.match(zipRegex);
    if (zipMatches && zipMatches.length > 0) {
      address.zipCode = zipMatches[0].split('-')[0];
    }

    // Extract state (convert full names to abbreviations)
    const stateMatches = normalizedText.match(stateRegex);
    if (stateMatches && stateMatches.length > 0) {
      const stateText = stateMatches[0].toLowerCase();
      address.state = stateMap[stateText] || stateMatches[0].toUpperCase().slice(0, 2);
    }

    // Extract name with better pattern matching
    const namePatterns = [
      /(?:name|recipient|ship\s*to|deliver\s*to|attention|attn)\s*[:;]?\s*([A-Za-z\s.'-]+)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)$/m,  // Capitalized names
    ];
    
    for (const pattern of namePatterns) {
      const nameMatch = normalizedText.match(pattern);
      if (nameMatch && nameMatch[1]) {
        const extractedName = nameMatch[1].trim();
        // Validate it's not a company or header
        if (!extractedName.match(/invoice|receipt|order|bill|company|inc|llc|corp/i) && extractedName.length > 2) {
          address.name = extractedName;
          break;
        }
      }
    }
    
    // Fallback: use first non-header line
    if (!address.name) {
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].trim();
        if (line.length > 2 && !line.match(/invoice|receipt|order|bill|date|number|#/i)) {
          address.name = line;
          break;
        }
      }
    }

    // Extract street address with enhanced patterns
    const streetPatterns = [
      /(?:address|street|addr)\s*[:;]?\s*([\d]+[\s\w.,-]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|court|ct|circle|cir|place|pl|parkway|pkwy))/i,
      /^([\d]+[\s\w.,-]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|court|ct|circle|cir|place|pl|parkway|pkwy)[\s\w.,-]*)$/im,
      /^([\d]+\s+[A-Za-z][\w\s.,-]+)$/m,  // Generic: number followed by text
    ];
    
    for (const pattern of streetPatterns) {
      const streetMatch = normalizedText.match(pattern);
      if (streetMatch && streetMatch[1]) {
        address.street = streetMatch[1].trim();
        break;
      }
    }
    
    // Fallback: look for lines starting with numbers
    if (!address.street) {
      for (const line of lines) {
        if (line.match(/^\d+\s+[A-Za-z]/)) {
          address.street = line.trim();
          break;
        }
      }
    }

    // Extract city with multiple strategies
    if (address.state || address.zipCode) {
      // Strategy 1: City, State ZIP pattern
      if (address.state && address.zipCode) {
        const cityStateZipRegex = new RegExp(`([A-Za-z\\s]+)[,\\s]+${address.state}[\\s,]+${address.zipCode}`, 'i');
        const cityMatch = normalizedText.match(cityStateZipRegex);
        if (cityMatch && cityMatch[1]) {
          address.city = cityMatch[1].trim();
        }
      }
      
      // Strategy 2: City, State pattern (without ZIP)
      if (!address.city && address.state) {
        const cityStateRegex = new RegExp(`([A-Za-z\\s]+)[,\\s]+${address.state}\\b`, 'i');
        const cityMatch = normalizedText.match(cityStateRegex);
        if (cityMatch && cityMatch[1]) {
          address.city = cityMatch[1].trim();
        }
      }
      
      // Strategy 3: Look for city keyword
      if (!address.city) {
        const cityPattern = /(?:city)\s*[:;]?\s*([A-Za-z\s]+)/i;
        const cityMatch = normalizedText.match(cityPattern);
        if (cityMatch && cityMatch[1]) {
          address.city = cityMatch[1].trim();
        }
      }
    }

    return address;
  };

  const preprocessImage = (imageData, mode = 'adaptive') => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Upscale for better OCR (2x)
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Draw scaled image with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        if (mode === 'adaptive') {
          // Advanced preprocessing with adaptive thresholding
          // Step 1: Convert to grayscale
          const grayData = new Uint8ClampedArray(canvas.width * canvas.height);
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            grayData[i / 4] = gray;
          }
          
          // Step 2: Apply Gaussian blur for noise reduction
          const blurredData = applyGaussianBlur(grayData, canvas.width, canvas.height);
          
          // Step 3: Adaptive thresholding (local)
          const blockSize = 15;
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const idx = y * canvas.width + x;
              
              // Calculate local mean
              let sum = 0;
              let count = 0;
              for (let dy = -blockSize; dy <= blockSize; dy++) {
                for (let dx = -blockSize; dx <= blockSize; dx++) {
                  const ny = y + dy;
                  const nx = x + dx;
                  if (ny >= 0 && ny < canvas.height && nx >= 0 && nx < canvas.width) {
                    sum += blurredData[ny * canvas.width + nx];
                    count++;
                  }
                }
              }
              const localMean = sum / count;
              
              // Apply threshold with bias
              const threshold = localMean - 10;
              const value = blurredData[idx] > threshold ? 255 : 0;
              
              const pixelIdx = idx * 4;
              data[pixelIdx] = value;
              data[pixelIdx + 1] = value;
              data[pixelIdx + 2] = value;
            }
          }
        } else {
          // Simple high-contrast mode
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const contrast = gray > 128 ? 255 : 0;
            data[i] = contrast;
            data[i + 1] = contrast;
            data[i + 2] = contrast;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };
      img.src = imageData;
    });
  };

  const applyGaussianBlur = (data, width, height) => {
    const kernel = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ];
    const kernelSum = 16;
    const result = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = (y + ky) * width + (x + kx);
            sum += data[idx] * kernel[ky + 1][kx + 1];
          }
        }
        result[y * width + x] = sum / kernelSum;
      }
    }
    return result;
  };

  const processImage = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setLoading(true);
    setProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      setPreview(e.target.result);
      
      try {
        // Optimized single-pass OCR with timeout protection
        setProgress(20);
        
        // Preprocess image for better accuracy
        const preprocessedImage = await Promise.race([
          preprocessImage(e.target.result, 'simple'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Preprocessing timeout')), 10000))
        ]);
        
        setProgress(30);
        
        // Run OCR with timeout
        const result = await Promise.race([
          Tesseract.recognize(preprocessedImage, 'eng', {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setProgress(30 + Math.round(m.progress * 60));
              }
            },
            tessedit_pageseg_mode: Tesseract.PSM.AUTO,
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,()-:/#\'',
            preserve_interword_spaces: '1',
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('OCR timeout')), 30000))
        ]);

        setProgress(95);

        const extractedText = result.data.text;

        const address = extractAddressFromText(extractedText);
        
        // Validate extracted address
        const score = calculateAddressScore(address);
        
        if (score >= 2) { // At least 2 fields extracted
          onAddressExtracted(address);
          toast.success(`Address extracted! (${score}/6 fields found)`);
          onClose();
        } else {
          toast.error('Could not extract address. Please try a clearer image or enter manually.');
        }
      } catch (error) {
        if (error.message.includes('timeout')) {
          toast.error('Processing took too long. Please try a smaller or clearer image.');
        } else {
          toast.error('Failed to process image. Please try again or enter manually.');
        }
      } finally {
        setLoading(false);
        setProgress(0);
      }
    };
    reader.readAsDataURL(file);
  };

  const calculateAddressScore = (address) => {
    let score = 0;
    if (address.name && address.name.length > 2) score++;
    if (address.phone && address.phone.match(/\(\d{3}\) \d{3}-\d{4}/)) score++;
    if (address.street && address.street.length > 5) score++;
    if (address.city && address.city.length > 2) score++;
    if (address.state && address.state.match(/^[A-Z]{2}$/)) score++;
    if (address.zipCode && address.zipCode.match(/^\d{5}$/)) score++;
    return score;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan Address from Image</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {!loading && !preview && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload an image of an invoice, shipping label, or document containing the delivery address.
              The system will automatically extract the address details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload size={48} className="text-gray-400 mb-3" />
                <span className="text-sm font-medium text-gray-700">Upload Image</span>
                <span className="text-xs text-gray-500 mt-1">JPG, PNG, PDF</span>
              </button>

              {/* Camera Capture */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Camera size={48} className="text-gray-400 mb-3" />
                <span className="text-sm font-medium text-gray-700">Take Photo</span>
                <span className="text-xs text-gray-500 mt-1">Use camera</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tips for best results:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Ensure good lighting and clear text</li>
                    <li>Avoid shadows and glare</li>
                    <li>Keep the document flat and in focus</li>
                    <li>Include the entire address section</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                />
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-8">
              <Loader size={48} className="text-blue-600 animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Processing image...</p>
              <p className="text-sm text-gray-500 mt-1">Extracting address information</p>
              
              {progress > 0 && (
                <div className="w-full max-w-xs mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setLoading(false);
                  setProgress(0);
                  setPreview(null);
                }}
                className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!loading && preview && (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain bg-gray-100 rounded-lg"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setPreview(null);
                  setProgress(0);
                }}
              >
                Try Another Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressScanner;
