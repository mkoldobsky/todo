using System.Data.Entity;
using System.Security.AccessControl;
using Todo.Model.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Todo.Data.Infrastructure
{
 

    public class UserContext : IdentityDbContext<ApplicationUser>
    {
        public UserContext()
            : base("UserContext")
        {


        }
        public virtual DbSet<Item> Departments { get; set; }


      
    }
}
