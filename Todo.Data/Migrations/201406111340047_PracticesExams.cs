namespace Clinisanitas.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PracticesExams : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Exams",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Practice_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Practices", t => t.Practice_Id)
                .Index(t => t.Practice_Id);
            
            CreateTable(
                "dbo.Practices",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        HasExams = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ApplicationUserExams",
                c => new
                    {
                        ApplicationUser_Id = c.String(nullable: false, maxLength: 128),
                        Exam_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.Exam_Id })
                .ForeignKey("dbo.AspNetUsers", t => t.ApplicationUser_Id, cascadeDelete: true)
                .ForeignKey("dbo.Exams", t => t.Exam_Id, cascadeDelete: true)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.Exam_Id);
            
            CreateTable(
                "dbo.ApplicationUserPractices",
                c => new
                    {
                        ApplicationUser_Id = c.String(nullable: false, maxLength: 128),
                        Practice_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.Practice_Id })
                .ForeignKey("dbo.AspNetUsers", t => t.ApplicationUser_Id, cascadeDelete: true)
                .ForeignKey("dbo.Practices", t => t.Practice_Id, cascadeDelete: true)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.Practice_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ApplicationUserPractices", "Practice_Id", "dbo.Practices");
            DropForeignKey("dbo.ApplicationUserPractices", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ApplicationUserExams", "Exam_Id", "dbo.Exams");
            DropForeignKey("dbo.ApplicationUserExams", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Exams", "Practice_Id", "dbo.Practices");
            DropIndex("dbo.ApplicationUserPractices", new[] { "Practice_Id" });
            DropIndex("dbo.ApplicationUserPractices", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.ApplicationUserExams", new[] { "Exam_Id" });
            DropIndex("dbo.ApplicationUserExams", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.Exams", new[] { "Practice_Id" });
            DropTable("dbo.ApplicationUserPractices");
            DropTable("dbo.ApplicationUserExams");
            DropTable("dbo.Practices");
            DropTable("dbo.Exams");
        }
    }
}
