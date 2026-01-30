interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}
