import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, ChevronLeft, ChevronRight as ChevronRightIcon, ShoppingBag } from 'lucide-react';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Button Component with Glass Theme Support
export const Button = ({ className, variant = 'primary', size = 'md', dark = false, children, ...props }) => {
    // dark prop now enables Glassmorphism for Super Admin
    const variants = dark ? {
        primary: 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md shadow-lg border border-white/10',
        secondary: 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/10',
        outline: 'border border-white/30 text-white hover:bg-white/10',
        ghost: 'text-white/70 hover:bg-white/10 hover:text-white',
        danger: 'bg-red-500/80 text-white hover:bg-red-600/90 shadow-lg shadow-red-500/20 backdrop-blur-md',
    } : {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-md',
        outline: 'border-2 border-slate-200 text-slate-600 hover:bg-slate-50',
        ghost: 'text-slate-600 hover:bg-slate-100',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm font-semibold',
        md: 'px-6 py-3 text-base font-bold',
        lg: 'px-8 py-4 text-lg font-black',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

// Card Component with Glass Theme Support
export const Card = ({ className, dark = false, children }) => (
    <div className={cn(
        'rounded-2xl transition-all duration-300',
        dark
            ? 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:scale-[1.01] hover:bg-white/15'
            : 'bg-white border border-slate-100 shadow-sm hover:shadow-md',
        className
    )}>
        {children}
    </div>
);

// StatCard Component
export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'orange', dark = false }) => {
    // If dark (Super Admin), override colors to be glass/white
    // We intentionally ignore the specific 'color' prop for the icon background to keep it uniform and clean in Glass mode,
    // or we can use it for subtle tint. Let's use subtle tint.

    return (
        <Card dark={dark} className="flex items-center gap-6 p-8">
            <div className={cn(
                'p-5 rounded-2xl backdrop-blur-md transition-transform hover:scale-110',
                dark
                    ? 'bg-white/10 border border-white/10 shadow-inner'
                    : {
                        orange: 'bg-orange-50 text-orange-600',
                        blue: 'bg-blue-50 text-blue-600',
                        green: 'bg-green-50 text-green-600',
                        purple: 'bg-purple-50 text-purple-600',
                    }[color]
            )}>
                <Icon size={32} className={dark ? 'text-white drop-shadow-sm' : ''} />
            </div>
            <div>
                <p className={cn('text-base font-bold mb-1', dark ? 'text-white/70' : 'text-slate-500')}>{title}</p>
                <h3 className={cn('text-4xl font-black tracking-tight', dark ? 'text-white drop-shadow-md' : 'text-slate-900')}>{value}</h3>
                {trend && (
                    <div className={cn('flex items-center gap-1 text-sm font-bold mt-2',
                        dark
                            ? (trend === 'up' ? 'text-green-300' : 'text-red-300')
                            : (trend === 'up' ? 'text-green-600' : 'text-red-600')
                    )}>
                        <span className={cn('px-2 py-0.5 rounded-full bg-white/10', dark && 'backdrop-blur-sm')}>
                            {trend === 'up' ? '↑' : '↓'} {trendValue}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

// Badge Component with Glass Theme Support
export const Badge = ({ children, variant = 'neutral', className, dark = false }) => {
    const variants = dark ? {
        neutral: 'bg-white/10 text-white/80 border border-white/20 backdrop-blur-md',
        success: 'bg-green-500/20 text-green-100 border border-green-500/30 backdrop-blur-md',
        warning: 'bg-amber-500/20 text-amber-100 border border-amber-500/30 backdrop-blur-md',
        danger: 'bg-red-500/20 text-red-100 border border-red-500/30 backdrop-blur-md',
        primary: 'bg-blue-500/20 text-blue-100 border border-blue-500/30 backdrop-blur-md',
    } : {
        neutral: 'bg-slate-100 text-slate-600',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        primary: 'bg-orange-100 text-orange-700',
    };

    return (
        <span className={cn('px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest', variants[variant], className)}>
            {children}
        </span>
    );
};

// Table Component with Glass Theme Support
export const Table = ({ headers, children, dark = false }) => (
    <div className={cn(
        'w-full overflow-x-auto rounded-3xl border transition-all',
        dark
            ? 'bg-white/5 backdrop-blur-md border-white/20 shadow-xl'
            : 'border-slate-100 bg-white'
    )}>
        <table className="w-full text-left border-collapse">
            <thead className={cn('border-b', dark ? 'bg-white/5 border-white/10' : 'bg-slate-50/50 border-slate-100')}>
                <tr>
                    {headers.map((header, idx) => (
                        <th key={idx} className={cn(
                            'px-6 py-6 text-sm font-black uppercase tracking-[0.15em] whitespace-nowrap',
                            dark ? 'text-white/80 shadow-sm' : 'text-slate-400'
                        )}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={cn('divide-y', dark ? 'divide-white/10 text-white font-medium text-base' : 'divide-slate-50')}>
                {children}
            </tbody>
        </table>
    </div>
);

// Input Component with Glass Theme Support
export const Input = ({ label, error, className, dark = false, ...props }) => (
    <div className="w-full space-y-2">
        {label && <label className={cn('text-xs font-black uppercase tracking-widest ml-1', dark ? 'text-white/80' : 'text-slate-500')}>{label}</label>}
        <input
            className={cn(
                'w-full px-5 py-4 rounded-2xl border outline-none transition-all text-base font-semibold',
                dark
                    ? 'border-white/20 bg-white/10 focus:bg-white/20 focus:ring-4 focus:ring-white/10 focus:border-white/40 placeholder:text-white/40 text-white backdrop-blur-sm'
                    : 'border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 placeholder:text-slate-300',
                error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
                className
            )}
            {...props}
        />
        {error && <p className="text-xs font-bold text-red-400 ml-1 backdrop-blur-sm inline-block px-2 py-0.5 rounded-lg bg-red-500/10">{error}</p>}
    </div>
);

// Textarea Component with Glass Theme Support
export const Textarea = ({ label, error, className, dark = false, ...props }) => (
    <div className="w-full space-y-2">
        {label && <label className={cn('text-xs font-black uppercase tracking-widest ml-1', dark ? 'text-white/80' : 'text-slate-500')}>{label}</label>}
        <textarea
            className={cn(
                'w-full px-5 py-4 rounded-2xl border outline-none transition-all text-base font-semibold min-h-[140px]',
                dark
                    ? 'border-white/20 bg-white/10 focus:bg-white/20 focus:ring-4 focus:ring-white/10 focus:border-white/40 placeholder:text-white/40 text-white backdrop-blur-sm scollbar-hide'
                    : 'border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 placeholder:text-slate-300',
                error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
                className
            )}
            {...props}
        />
        {error && <p className="text-xs font-bold text-red-400 ml-1 backdrop-blur-sm inline-block px-2 py-0.5 rounded-lg bg-red-500/10">{error}</p>}
    </div>
);

// Modal Component with Glass Theme Support
export const Modal = ({ isOpen, onClose, title, children, footer, dark = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className={cn(
                'relative rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col',
                dark
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                    : 'bg-white border border-white/20'
            )}>
                <div className={cn(
                    'px-10 py-8 border-b flex items-center justify-between',
                    dark ? 'border-white/10 bg-white/5' : 'border-slate-50 bg-white'
                )}>
                    <h2 className={cn('text-2xl font-black tracking-tighter', dark ? 'text-white' : 'text-slate-900')}>{title}</h2>
                    <button onClick={onClose} className={cn('p-2.5 rounded-2xl transition-all', dark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-slate-50 text-slate-400')}>
                        <X size={20} />
                    </button>
                </div>
                <div className={cn('px-10 py-8 overflow-y-auto flex-1 scrollbar-hide', dark && 'text-white')}>
                    {children}
                </div>
                {footer && (
                    <div className={cn(
                        'px-10 py-6 border-t flex justify-end gap-3',
                        dark ? 'border-white/10 bg-white/5' : 'border-slate-50 bg-slate-50/30'
                    )}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// Pagination Component with Glass Theme Support
export const Pagination = ({ currentPage, totalPages, onPageChange, dark = false }) => (
    <div className="flex items-center justify-between mt-8 px-2">
        <p className={cn('text-xs font-bold italic', dark ? 'text-white/60' : 'text-slate-400')}>
            Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1.5">
            <Button
                variant="outline"
                size="sm"
                dark={dark}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-xl h-10 w-10 p-0"
            >
                <ChevronLeft size={18} />
            </Button>
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => onPageChange(idx + 1)}
                        className={cn(
                            'h-10 w-10 rounded-xl text-xs font-black transition-all',
                            currentPage === idx + 1
                                ? dark
                                    ? 'bg-white/20 text-white shadow-lg border border-white/20 backdrop-blur-md'
                                    : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                                : dark
                                    ? 'text-white/50 hover:bg-white/10 hover:text-white'
                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        )}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
            <Button
                variant="outline"
                size="sm"
                dark={dark}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-xl h-10 w-10 p-0"
            >
                <ChevronRightIcon size={18} />
            </Button>
        </div>
    </div>
);

// Loader Component with Glass Theme Support
export const Loader = ({ dark = false }) => (
    <div className={cn(
        'flex flex-col items-center justify-center py-24 gap-6 rounded-[2.5rem] border shadow-sm transition-all',
        dark
            ? 'bg-white/5 border-white/10 backdrop-blur-md'
            : 'bg-white border-slate-50'
    )}>
        <div className={cn(
            'w-14 h-14 border-[5px] rounded-full animate-spin shadow-lg',
            dark
                ? 'border-white/10 border-t-white shadow-white/10'
                : 'border-orange-50 border-t-orange-500 shadow-orange-500/5'
        )} />
        <p className={cn(
            'text-[10px] font-black uppercase tracking-[0.3em] animate-pulse',
            dark ? 'text-white/70' : 'text-slate-300'
        )}>Analyzing Server Data</p>
    </div>
);

// Empty State with Glass Theme Support
export const EmptyState = ({ title, message, icon: Icon = ShoppingBag, dark = false }) => (
    <div className={cn(
        'flex flex-col items-center justify-center py-24 text-center rounded-[2.5rem] border-2 border-dashed transition-all',
        dark
            ? 'bg-white/5 border-white/10 backdrop-blur-md'
            : 'bg-white border-slate-100/80'
    )}>
        <div className={cn(
            'p-8 rounded-[2rem] mb-6 shadow-inner transition-transform hover:scale-110',
            dark
                ? 'bg-white/10 text-white border border-white/10'
                : 'bg-slate-50 text-slate-300'
        )}>
            <Icon size={56} className="drop-shadow-md" />
        </div>
        <h3 className={cn('text-xl font-black mb-2 tracking-tight', dark ? 'text-white' : 'text-slate-900')}>{title}</h3>
        <p className={cn('max-w-xs text-sm font-semibold leading-relaxed tracking-tight', dark ? 'text-white/50' : 'text-slate-400')}>{message}</p>
    </div>
);
