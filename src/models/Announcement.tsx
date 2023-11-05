interface Announcement {
    announcementId: number;
    title: string;
    content: string;
    isPublished: boolean;
    scheduledStartPublish: Date;
    scheduledEndPublish: Date;
  }
  
  export default Announcement;