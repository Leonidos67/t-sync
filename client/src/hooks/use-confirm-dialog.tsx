/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<any>(null);

  const onOpenDialog = (data?: any) => {
    setContext(data || null);
    setOpen(true);
  };

  const onCloseDialog = () => {
    setContext(null);
    setOpen(false);
  };

  return {
    open,
    context,
    onOpenDialog,
    onCloseDialog,
  };
};

export default useConfirmDialog;
