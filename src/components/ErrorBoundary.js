import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function FallbackComponent({ error, resetErrorBoundary }) {
    const handleResetAndRedirect = () => {
        resetErrorBoundary();
        window.location.href = '/';
    };

    return (
        <div className="flex flex-col grow justify-center items-center space-y-4">
            <h1>Something went wrong. Please refresh the page</h1>
            {/* <pre>{error.message}</pre> */}
            <button
                onClick={handleResetAndRedirect}
                className="px-2 md:px-4 py-2 text-sm font-bold text-white bg-primary rounded-md border border-primary hover:bg-primaryDark "
            >
                Refresh
            </button>
        </div>
    );
}

function CustomErrorBoundary({ children }) {
    return (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
            {children}
        </ErrorBoundary>
    );
}

export default CustomErrorBoundary;
