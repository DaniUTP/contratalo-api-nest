export class ConstantsUtil
{
    public static getConstraintValue(field: string, constraint: string): string {
    const values = {
      'password.minLength': process.env.PASSWORD_MIN_LENGTH || '8',
      'password.maxLength': process.env.PASSWORD_MAX_LENGTH || '150',
      'email.maxLength': process.env.EMAIL_MAX_LENGTH || '100',
      'name.maxLength': process.env.NAME_MAX_LENGTH || '20',
      'name.minLength': process.env.NAME_MIN_LENGTH || '2',
      'last_name.maxLength': process.env.LAST_NAME_MAX_LENGTH || '20',
      'last_name.minLength': process.env.LAST_NAME_MIN_LENGTH || '2',
      'token_fcm.maxLength':process.env.TOKEN_FCM_MAX_LENGTH || '150',
      'code.isLength':process.env.CODE_MAX_LENGTH || '6'
    }
    const key = `${field.toLowerCase().trim()}.${constraint.trim()}`;
    console.log("key:",key)
    return values[key] || '';
  }
}