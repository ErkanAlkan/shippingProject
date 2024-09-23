import Swal, { SweetAlertResult } from 'sweetalert2';

export const showLoadingAlert = (message = 'Fetching data, please wait...') => {
  Swal.fire({
    title: 'Loading...',
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
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
  Swal.fire({
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
