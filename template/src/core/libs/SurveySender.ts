import SchedulePost from "./SchedulePost"
import schedulePBBodyFactory from "./scheduleBodyFactory"
import CompanyConfig from "./Company"
const company = CompanyConfig.getInstance()

type dataType = {
  survey: keyof typeof company.surveys // Survey Code
  channel: string // channel Id
  sender: ObjectId // sender Id
  field: Record<string, string | number | string[] | number[]>
}

type optionsType<T> = {
  hide?: Record<keyof T, boolean>,
  recipient?: ObjectId,
  saved?: boolean
}

export default class SurveySender extends SchedulePost {
  constructor(
    data: dataType, botOptions: optionsType<typeof data.field>,
    ) {
      super(SurveySender._buildBody(data, botOptions))
    }
    private static _buildBody(data: dataType, botOptions: optionsType<typeof data.field>) {
      const owner = `${company.subdomain}-survey-sender` 
      const code = `surveysender_${data.survey}`
      const botOptions_ = {
        survey: '$VALUE#survey',
        channel: '$VALUE#channel',
        recipient: botOptions.recipient ?? '',
        sender: '$VALUE#sender',
        saved: botOptions.saved ?? false,
        field: '$VALUE#field',
        hide: botOptions.hide ?? {} // Object.fromEntries(Object.keys(data.field).map(k => ([k,false])))
      }
      const stages = [{
        key: 'start', name: 'PBSendSurvey',
        data: botOptions_, next: { DEFAULT: '' }
      }]
      return schedulePBBodyFactory(code, owner, stages as any, data)
    }
    public async send() {
      try {
        const result = await super.run()
        return result
      } catch (error) {
        console.error(error)
        return
      }
    }
  }
  