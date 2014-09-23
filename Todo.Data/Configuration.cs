using Clinisanitas.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Clinisanitas.Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class ConfigurationOld : DbMigrationsConfiguration<Clinisanitas.Data.UserContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }
        private bool AddUser(UserContext context)
        {
            IdentityResult identityResult;
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            var user = new ApplicationUser()
            {
                UserName = "admin",
                Names = "Admin"
            };
            string userId;
            var existingUser = userManager.FindByName(user.UserName);
            if (existingUser == null)
            {
                identityResult = userManager.Create(user, "Passw0rd!");
                userId = user.Id;
            }
            else
            {
                userId = existingUser.Id;
            }

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

            // Create Admin Role
            string roleName = "Admin";
            IdentityResult roleResult;

            // Check to see if Role Exists, if not create it
            if (!roleManager.RoleExists(roleName))
            {
                roleResult = roleManager.Create(new IdentityRole(roleName));
                if (roleResult.Succeeded)
                {
                    var result = userManager.AddToRole(userId, roleName);
                }
            }

            base.Seed(context);
            return true;
        }
        protected override void Seed(UserContext context)
        {
            AddUser(context);
        }
    }
}
