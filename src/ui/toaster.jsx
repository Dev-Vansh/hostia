import * as React from 'react';
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastTitle,
} from '@/ui/toast';

export function Toaster() {
	const [toasts, setToasts] = React.useState([]);

	React.useEffect(() => {
		// Listen for toast events
		const handleToast = (event) => {
			const toast = event.detail;
			const id = Date.now() + Math.random(); // Unique ID
			const newToast = { ...toast, id };

			setToasts((prev) => [...prev, newToast]);

			// Auto-dismiss after 3 seconds
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 3000);
		};

		window.addEventListener('show-toast', handleToast);
		return () => window.removeEventListener('show-toast', handleToast);
	}, []);

	return (
		<div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]">
			{toasts.map((toast) => (
				<Toast key={toast.id} variant={toast.variant}>
					<div className="grid gap-1">
						{toast.title && <ToastTitle>{toast.title}</ToastTitle>}
						{toast.description && <ToastDescription>{toast.description}</ToastDescription>}
					</div>
					<ToastClose onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
				</Toast>
			))}
		</div>
	);
}