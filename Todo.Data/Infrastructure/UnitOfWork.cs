namespace Todo.Data.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private UserContext _dbContext;
        private readonly IDatabaseFactory _dbFactory;
        protected UserContext DbContext
        {
            get
            {
                return _dbContext ?? _dbFactory.Get();
            }
        }

        public UnitOfWork(IDatabaseFactory dbFactory)
        {
            this._dbFactory = dbFactory;
        }

        public void SaveChanges()
        {
            DbContext.SaveChanges();
        }
    }
}
