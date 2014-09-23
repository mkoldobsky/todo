namespace Clinisanitas.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FixProspectCompany : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Prospects", "Company_Id", "dbo.Companies");
            DropIndex("dbo.Prospects", new[] { "Company_Id" });
            RenameColumn(table: "dbo.Prospects", name: "Company_Id", newName: "Companyid");
            AlterColumn("dbo.Prospects", "Companyid", c => c.Int(nullable: false));
            CreateIndex("dbo.Prospects", "Companyid");
            AddForeignKey("dbo.Prospects", "Companyid", "dbo.Companies", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Prospects", "Companyid", "dbo.Companies");
            DropIndex("dbo.Prospects", new[] { "Companyid" });
            AlterColumn("dbo.Prospects", "Companyid", c => c.Int());
            RenameColumn(table: "dbo.Prospects", name: "Companyid", newName: "Company_Id");
            CreateIndex("dbo.Prospects", "Company_Id");
            AddForeignKey("dbo.Prospects", "Company_Id", "dbo.Companies", "Id");
        }
    }
}
