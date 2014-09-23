using System.Collections.Generic;
using Todo.Data.Infrastructure;
using Todo.Model.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.Provider;

namespace Todo.Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<UserContext>
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
                UserName = "Admin",
                Name = "Admin",
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

            // Create Config Role
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

            roleName = "User";

            if (!roleManager.RoleExists(roleName))
            {
                roleResult = roleManager.Create(new IdentityRole(roleName));
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
