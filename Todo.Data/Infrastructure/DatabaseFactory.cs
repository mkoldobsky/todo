namespace Todo.Data.Infrastructure
{
    public class DatabaseFactory : Disposable, IDatabaseFactory
    {
        private UserContext _dataContext;
        public UserContext Get()
        {
            return _dataContext ?? (_dataContext = new UserContext());
        }
        protected override void DisposeCore()
        {
            if (_dataContext != null)
                _dataContext.Dispose();
        }
    }
}
