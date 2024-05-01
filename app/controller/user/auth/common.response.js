const db = require('../../../models');
module.exports = {
  logInRes: (response) => {
    return response = {
      id: response.isExisting.id,
      slug: response.isExisting.slug,
      role_id: response.isExisting.role_id,
      full_name: response.isExisting.full_name,
      phone_no: response.isExisting.phone_no,
      profile_image: response.isExisting.profile_image,
      accessToken: response.token,
    }
  },
  modifyUserRes: (response) => {
    const obj = {
      id: response.id,
      full_name: response.full_name,
      email: response.email,
      slug: response.slug,
      countryCode: response.countryCode,
      phone_no: response.phone_no,
      profile_image: response.profile_image
    }
    return obj
  }
}
