type IExternalLink = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function ExternalLink({
  href,
  children,
  className,
}: IExternalLink) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}
