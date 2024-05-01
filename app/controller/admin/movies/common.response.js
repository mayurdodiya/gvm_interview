const db = require('../../../models');
module.exports = {
  logInRes: (response) => {
    return response = {
      id: response.isExistingEmail.id,
      slug: response.isExistingEmail.slug,
      role_id: response.isExistingEmail.role_id,
      full_name: response.isExistingEmail.full_name,
      accessToken: response.token,
      profile_image: response.isExistingEmail.profile_image,
    }
  },
  modifyAdminRes: (response) => {
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
