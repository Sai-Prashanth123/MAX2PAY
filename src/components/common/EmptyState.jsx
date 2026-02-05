import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon = Inbox, 
  title = "No data found", 
  description = "Get started by adding your first item",
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  helpText,
  helpLink
}) => {
  const Icon = icon;
  
  return (
    <div className="empty-state animate-fadeIn">
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-full p-8 mb-6 animate-scaleIn shadow-sm">
        <Icon className="h-16 w-16 text-primary-600" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-base text-slate-600 text-center max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" className="mb-4">
          {ActionIcon && <ActionIcon className="h-5 w-5 mr-2" />}
          {actionLabel}
        </Button>
      )}
      {helpText && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">Tip:</span> {helpText}
            {helpLink && (
              <a href={helpLink} className="ml-1 text-blue-600 hover:text-blue-800 underline">
                Learn more
              </a>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
