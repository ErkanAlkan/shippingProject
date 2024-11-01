import Swal, { SweetAlertResult } from 'sweetalert2';

export const showLoadingAlert = () => {
  Swal.fire({
    title: '',
    html: '<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      popup: 'loading-spinner'
    },
    didOpen: () => {
    }
  });
};

export const showErrorAlert = (message = 'An error occurred') => {
  Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  });
};

export const showSuccessAlert = (message = 'Operation successful') => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6',
  });
};

export const showConfirmAlert = async (
  message = 'Are you sure?',
  confirmText = 'Yes, delete it!'
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title: message,
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });
};

export const showWarningAlert = (message: string = 'Warning: Something requires your attention!') => {
  Swal.fire({
    title: "Warning",
    text: message,
    icon: "warning",
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  });
};
