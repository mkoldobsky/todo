using AutoMapper;

namespace Todo.API.Mappers
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            Mapper.Initialize(mapper =>
            { 
                mapper.AddProfile<ViewModelToDomainMappingProfile>() ;
                mapper.AddProfile<DomainToViewModelMappingProfile>();
            });
            
        }
    }
}