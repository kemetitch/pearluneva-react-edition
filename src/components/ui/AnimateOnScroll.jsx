import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function AnimateOnScroll({
  children,
  className = "",
  as: Tag = "div",
  ...props
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <Tag
      ref={ref}
      className={`animate-on-scroll${isVisible ? " animated" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
