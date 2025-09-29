import { X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

const POPUP_TYPES = {
  success: "text-green-500",
  warning: "text-orange-500",
  danger: "text-red-500",
  info: "text-blue-500",
  neutral: "text-gray-500",
};

export function Popup({
  isOpen,
  onClose,
  type = "neutral",
  icon: IconComponent,
  title,
  description,
  primaryButton,
  secondaryButton,
  children,
}) {
  const iconColorClass = POPUP_TYPES[type] || POPUP_TYPES.neutral;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-card rounded-3xl p-6 shadow-2xl border border-border/50 max-w-sm w-full mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            <div className="text-center space-y-4">
              {IconComponent && (
                <div className="w-16 h-16 bg-gray-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <IconComponent className={`w-8 h-8 ${iconColorClass}`} />
                </div>
              )}

              {(title || description) && (
                <div>
                  {title && (
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {children && <div>{children}</div>}

              {(primaryButton || secondaryButton) && (
                <div className="flex space-x-3 pt-4">
                  {secondaryButton && (
                    <Button
                      variant={secondaryButton.variant || "secondary"}
                      size={secondaryButton.size || "lg"}
                      width="full"
                      onClick={secondaryButton.onClick}
                      {...secondaryButton.props}
                    >
                      {secondaryButton.text}
                    </Button>
                  )}

                  {primaryButton && (
                    <Button
                      variant={primaryButton.variant || "primary"}
                      size={primaryButton.size || "lg"}
                      width="full"
                      onClick={primaryButton.onClick}
                      {...primaryButton.props}
                    >
                      {primaryButton.text}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
