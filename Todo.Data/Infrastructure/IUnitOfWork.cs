namespace Todo.Data.Infrastructure
{
    public interface IUnitOfWork
    {
        void SaveChanges();
    }
}
