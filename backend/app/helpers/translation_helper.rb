module TranslationHelper
  def translate_to_japanese(text)
    require "google/cloud/translate/v2"

    translate = Google::Cloud::Translate::V2.new project_id: 'shotsharing-login', credentials: 'config/shotsharing-login-7d03a6716bb3.json'

    translation = translate.translate text, to: 'ja'

    translation.text
  end
end
