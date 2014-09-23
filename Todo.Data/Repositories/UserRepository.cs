using System.Collections.Generic;
using System.Linq;
using Todo.Data.Infrastructure;
using Todo.Model.Models;

namespace Todo.Data.Repositories
{
    public class UserRepository : RepositoryBase<ApplicationUser>, IUserRepository
    {

        public UserRepository(IDatabaseFactory dbFactory)
            : base(dbFactory)
        {

        }

        public ApplicationUser GetByUsername(string userName)
        {
            return base.DataContext.Users.FirstOrDefault(x => x.UserName == userName);
        }
    }


    public interface IUserRepository : IRepository<ApplicationUser>
    {
        ApplicationUser GetByUsername(string userName);

    }
}
