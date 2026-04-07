import Swal from "sweetalert2";

// ✅ SUCCESS
export const showSuccess = (message = "Success") => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

// ✅ ERROR
export const showError = (error) => {
  let msg = "Something went wrong";

  if (typeof error === "string") {
    msg = error;
  } else if (typeof error === "object") {
    msg = Object.values(error).flat().join("\n");
  }

  Swal.fire({
    icon: "error",
    title: "Error",
    text: msg,
    confirmButtonColor: "#d33",
  });
};

// ✅ CONFIRM
export const showConfirm = async (text = "Are you sure?") => {
  const result = await Swal.fire({
    title: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0891B2",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  });

  return result.isConfirmed;
};

// ✅ LOADING
export const showLoading = (text = "Please wait...") => {
  Swal.fire({
    title: text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => {
  Swal.close();
};