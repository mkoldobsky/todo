using Todo.Data.Infrastructure;
using Todo.Model.Models;

namespace Todo.Data.Repositories
{
    public class TodoRepository : RepositoryBase<Item>, ITodoRepository
    {
        public TodoRepository(IDatabaseFactory databaseFactory)
            : base(databaseFactory)
        {

        }
    }

    public interface ITodoRepository : IRepository<Item>
    {

    }
}
