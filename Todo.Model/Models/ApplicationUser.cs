using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Todo.Model.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string Name { get; set; }
        public string LastName { get; set; }

    }
}
