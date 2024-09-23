"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const ModalDishDetail = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(open);
          router.back();
        }
      }}
    >
      <DialogContent className="max-h-full overflow-auto">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalDishDetail;
