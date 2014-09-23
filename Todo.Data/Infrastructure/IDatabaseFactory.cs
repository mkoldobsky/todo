using System;

namespace Todo.Data.Infrastructure 
{
    public interface IDatabaseFactory : IDisposable
    {
        UserContext Get();
    }
}
