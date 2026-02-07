import { toast } from "sonner";

/**
 * Standardized toast notification utilities
 * Ensures consistent messaging patterns across the application
 */

// Success messages for common actions
export const toastSuccess = {
    // Auth
    signedIn: () => toast.success("Signed in successfully!"),
    signedOut: () => toast.success("Signed out successfully"),
    accountCreated: () => toast.success("Account created successfully! Please sign in."),

    // Posts
    postSaved: () => toast.success("Post saved as draft"),
    postUpdated: () => toast.success("Post updated"),
    postDeleted: () => toast.success("Post deleted successfully"),
    postsDeleted: (count: number) => toast.success(`${count} post(s) deleted successfully`),

    // Publish requests
    publishRequested: () => toast.success("Publish request submitted"),
    requestApproved: () => toast.success("Request approved - Post is now published"),
    requestRejected: () => toast.success("Request rejected"),
    requestCancelled: () => toast.success("Publish request cancelled"),

    // Comments
    commentPosted: () => toast.success("Comment posted successfully!"),
    commentUpdated: () => toast.success("Comment updated successfully!"),
    commentDeleted: () => toast.success("Comment deleted successfully!"),

    // Tags
    tagCreated: () => toast.success("Tag created successfully"),
    tagUpdated: () => toast.success("Tag updated successfully"),
    tagDeleted: () => toast.success("Tag deleted successfully"),

    // Users
    roleUpdated: (role: string) => toast.success(`Role updated to ${role}`),

    // Uploads
    imageUploaded: () => toast.success("Image uploaded successfully"),
    imageInserted: () => toast.success("Image uploaded and inserted"),

    // Generic
    saved: () => toast.success("Saved successfully"),
    updated: () => toast.success("Updated successfully"),
    deleted: () => toast.success("Deleted successfully"),
    created: () => toast.success("Created successfully"),
};

// Error messages for common failures
export const toastError = {
    // Auth
    signInFailed: (message?: string) => toast.error(message || "Failed to sign in"),
    signUpFailed: (message?: string) => toast.error(message || "Failed to create account"),
    unauthorized: () => toast.error("You are not authorized to perform this action"),

    // Posts
    postSaveFailed: (message?: string) => toast.error(message || "Failed to save post"),
    postDeleteFailed: (message?: string) => toast.error(message || "Failed to delete post"),
    postsDeleteFailed: (message?: string) => toast.error(message || "Failed to delete posts"),

    // Publish requests
    publishRequestFailed: (message?: string) =>
        toast.error(message || "Failed to submit publish request"),
    approveFailed: (message?: string) => toast.error(message || "Failed to approve request"),
    rejectFailed: (message?: string) => toast.error(message || "Failed to reject request"),
    cancelFailed: (message?: string) => toast.error(message || "Failed to cancel request"),

    // Comments
    commentPostFailed: (message?: string) => toast.error(message || "Failed to post comment"),
    commentUpdateFailed: (message?: string) => toast.error(message || "Failed to update comment"),
    commentDeleteFailed: (message?: string) => toast.error(message || "Failed to delete comment"),
    commentEmpty: () => toast.error("Comment cannot be empty"),

    // Tags
    tagCreateFailed: (message?: string) => toast.error(message || "Failed to create tag"),
    tagUpdateFailed: (message?: string) => toast.error(message || "Failed to update tag"),
    tagDeleteFailed: (message?: string) => toast.error(message || "Failed to delete tag"),

    // Users
    roleUpdateFailed: (message?: string) => toast.error(message || "Failed to update role"),

    // Uploads
    uploadFailed: (message?: string) => toast.error(message || "Failed to upload image"),
    invalidFileType: () => toast.error("Please select an image file"),
    fileTooLarge: (maxSize = "5MB") => toast.error(`Image must be less than ${maxSize}`),

    // Validation
    validationError: () => toast.error("Please fix form errors before continuing"),
    saveFirst: () => toast.error("Please save the post first"),

    // Generic
    unexpected: () => toast.error("An unexpected error occurred"),
    networkError: () => toast.error("Network error. Please check your connection."),
    serverError: () => toast.error("Server error. Please try again later."),
    notFound: () => toast.error("Resource not found"),
    generic: (message?: string) => toast.error(message || "An error occurred"),
};

// Info/warning messages
export const toastInfo = {
    loading: (message = "Loading...") => toast.loading(message),
    processing: () => toast.loading("Processing..."),
    uploading: () => toast.loading("Uploading..."),
};

// Promise-based toast for async operations
export const toastPromise = <T>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    },
) => {
    return toast.promise(promise, messages);
};
