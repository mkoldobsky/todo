using AutoMapper;
using Todo.API.ViewModels;
using Todo.Model.Models;

namespace Todo.API.Mappers
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public override string ProfileName
        {
            get
            {
                return "ViewModelToDomainMappingProfile";
            }
        }

        protected override void Configure()
        {
            Mapper.CreateMap<CompanyViewModel, Company>();
            Mapper.CreateMap<RegisterViewModel, ApplicationUser>();
            Mapper.CreateMap<ProspectViewModel, Prospect>();
            Mapper.CreateMap<CapacityViewModel, Schedule>();
            Mapper.CreateMap<PatientViewModel, Patient>();
            Mapper.CreateMap<ProtocolViewModel, Protocol>();
            Mapper.CreateMap<PracticeViewModel, Practice>();
            Mapper.CreateMap<TriajeViewModel, Triaje>();
            Mapper.CreateMap<IdNameViewModel, Department>();
            Mapper.CreateMap<IdNameViewModel, State>();
            Mapper.CreateMap<IdNameViewModel, District>();
            Mapper.CreateMap<CountryViewModel, Country>();
        }
    }
}