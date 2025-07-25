import { motion } from "framer-motion";

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.3 }
    }
  }
};

export const AutomationIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={pathVariants}
      initial="hidden"
      animate="visible"
    />
  </svg>
);

export const LandingPageIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.rect 
      x="3" y="3" width="18" height="18" rx="2" 
      stroke="currentColor" strokeWidth="2"
      variants={pathVariants}
      initial="hidden"
      animate="visible"
    />
    <motion.line 
      x1="9" y1="9" x2="15" y2="9" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      variants={pathVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
    />
    <motion.line 
      x1="9" y1="15" x2="15" y2="15" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      variants={pathVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.5 }}
    />
    <motion.rect 
      x="6" y="12" width="3" height="3" 
      fill="currentColor"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.7, type: "spring" }}
    />
  </svg>
);

export const ConsultingIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.circle 
      cx="12" cy="12" r="10" 
      stroke="currentColor" strokeWidth="2"
      variants={pathVariants}
      initial="hidden"
      animate="visible"
    />
    <motion.path
      d="M12 16v-4l-3-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={pathVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.5 }}
    />
    {[{cx: 12, cy: 12}, {cx: 12, cy: 5}, {cx: 19, cy: 12}, {cx: 5, cy: 12}, {cx: 12, cy: 19}].map((pos, i) => (
      <motion.circle 
        key={i}
        cx={pos.cx} cy={pos.cy} r="1" 
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
      />
    ))}
  </svg>
);

export const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);