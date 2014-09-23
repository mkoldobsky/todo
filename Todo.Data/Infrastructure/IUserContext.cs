using System.Data.Entity;
using Todo.Model.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Todo.Data.Infrastructure
{
    public interface IUserContext
    {
        IDbSet<IdentityUser> Users { get; set; }
        IDbSet<IdentityRole> Roles { get; set; }
    }
}
