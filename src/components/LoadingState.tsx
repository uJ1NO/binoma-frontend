import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
    message = 'Loading...', 
    fullScreen = false 
}) => {
    const content = (
        <div className="flex flex-col items-center justify-center p-6">
            <Loader2 className="w-8 h-8 text-binomena-primary animate-spin mb-4" />
            <p className="text-gray-400">{message}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl">
            {content}
        </div>
    );
}; 