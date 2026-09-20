const baseConfig = {
  background: "#18181b",
  color: "#f4f4f5",
  confirmButtonColor: "#f97316",
  cancelButtonColor: "#3f3f46",
  buttonsStyling: true,
};

const getSwal = async () => {
  const { default: Swal } = await import("sweetalert2");
  return Swal;
};

export const showSuccess = async (title: string, text?: string) =>
  (await getSwal()).fire({
    ...baseConfig,
    icon: "success",
    title,
    text,
    iconColor: "#fb923c",
    timer: 2200,
    showConfirmButton: false,
  });

export const showError = async (title: string, text?: string) =>
  (await getSwal()).fire({
    ...baseConfig,
    icon: "error",
    title,
    text,
    iconColor: "#f87171",
  });

export const confirmAction = async (title: string, text: string) => {
  const result = await (await getSwal()).fire({
    ...baseConfig,
    icon: "warning",
    title,
    text,
    iconColor: "#fb923c",
    showCancelButton: true,
    confirmButtonText: "Yes, continue",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const showInfo = async (title: string, text?: string) =>
  (await getSwal()).fire({
    ...baseConfig,
    icon: "info",
    title,
    text,
    iconColor: "#fdba74",
  });
