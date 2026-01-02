import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $role: String!) {
    registerUser(name: $name, role: $role) {
      id
      name
      role
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      id
      name
      phone
      deliveryAddress
    }
  }
`;

export const SET_NOTIFICATION_PREFERENCES = gql`
  mutation SetNotificationPreferences($input: NotificationPreferencesInput!) {
    setNotificationPreferences(input: $input) {
      pushNotifications
      emailUpdates
      orderUpdates
    }
  }
`;

export const UPLOAD_PROFILE_PICTURE = gql`
  mutation UploadProfilePicture($file: Upload!) {
    uploadProfilePicture(file: $file) {
      id
      profilePicture
    }
  }
`;


