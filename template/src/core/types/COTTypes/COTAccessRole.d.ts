declare interface COTAccessRole {
    _id: ObjectId;
    active: boolean;
    company: ObjectId;
    createdAt: Date;
    description: string;
    modifiedAt:  Date;
    name: string;
    permissions: string[];
}
