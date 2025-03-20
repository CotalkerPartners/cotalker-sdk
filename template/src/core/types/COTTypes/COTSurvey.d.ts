/* 
Debiese haber un tipo general para el survey, api o no? Es una idea nada mas, no esta implementado.
*/
declare type SurveyAPI = {
    _id: ObjectId
    code: ObjectId | string
    display: string
    subproperties: Object[] | ObjectId | string
}