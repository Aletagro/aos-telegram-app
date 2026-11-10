const params = new URLSearchParams((window.location?.href || '').split('?')[1])

export const isVk = params.has('vk_user_id')

export const isVkMobile = isVk && (params.get('vk_platform') || '').startsWith('mobile')
