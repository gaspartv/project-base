interface UpdatePhotoUserMapper {
  imageUri: string
}

export function updatePhotoUserMapper({ imageUri }: UpdatePhotoUserMapper) {
  return {
    imageUri
  }
}
