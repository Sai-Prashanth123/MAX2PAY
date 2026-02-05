import { useEffect, useRef, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import { Camera, X } from 'lucide-react';
import Button from './Button';

const BarcodeScanner = ({ onDetected, onClose, onError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      initializeScanner();
    }

    return () => {
      if (Quagga) {
        Quagga.stop();
      }
    };
  }, [isScanning]);

  const initializeScanner = () => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader',
          ],
        },
        locate: true,
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
      },
      (err) => {
        if (err) {
          onError?.(err);
          setError('Failed to initialize camera. Please ensure camera permissions are granted.');
          setIsScanning(false);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(handleDetected);
  };

  const handleDetected = (result) => {
    if (result && result.codeResult && result.codeResult.code) {
      const code = result.codeResult.code;
      onDetected(code);
      stopScanner();
    }
  };

  const startScanner = () => {
    setError(null);
    setIsScanning(true);
  };

  const stopScanner = () => {
    setIsScanning(false);
    if (Quagga) {
      Quagga.stop();
    }
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan Barcode</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-4">
          {!isScanning ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <Camera size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Click the button below to start scanning</p>
              <Button onClick={startScanner}>
                <Camera size={20} /> Start Camera
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={scannerRef}
                className="w-full h-96 bg-black rounded-lg overflow-hidden"
              />
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 transform -translate-y-1/2" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Position the barcode within the camera view
          </p>
          {isScanning && (
            <Button variant="secondary" onClick={stopScanner}>
              Stop Scanning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
