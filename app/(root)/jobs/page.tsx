import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import searchImage from "./../../../public/icons/search.svg";
import CommonFilter from "@/components/filters/CommonFilter";
import JobCard from "@/components/cards/JobCard";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_JOBS } from "@/constants/states";
import { fetchHandler } from "@/lib/handlers/fetch";

interface searchParams {
  query?: string;
  filter?: string;
  page?: string;
  pageSize?: string;
}

interface Country {
  name: {
    common: string;
  };
  cca2: string;
}

interface LocationResponse {
  country: string;
  countryCode: string;
}

interface ApplyOption {
  apply_link: string;
}

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_country: string;
  job_employment_type: string;
  job_salary: string;
  job_description: string;
  apply_options: ApplyOption[];
}

interface JobResponse {
  data: Job[];
}

const generateUniqueId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${random}`;
};

const FindJops = async ({searchParams}: {searchParams: searchParams}) => {
  const allCountries = await fetchHandler<Country[]>("https://restcountries.com/v3.1/all", {
    method: "GET",
  });

  const location = await fetchHandler<LocationResponse>("http://ip-api.com/json", {
    method: "GET",
  });

  const {query = "development", page = "1", pageSize = 10, filter} = searchParams;
  const countryCode = filter || (location as unknown as LocationResponse)?.countryCode || 'eg';

  const countryFilters = ((allCountries as unknown as Country[]) || []).map((country) => ({
    name: country.name.common,
    value: country.cca2.toLowerCase()
  }));

  const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=${pageSize}&country=${countryCode}&date_posted=all`;

  const jobs = await fetchHandler<JobResponse>(url, {
    method: "GET",
    headers: {
      'x-rapidapi-key': '19b3483040mshd28ccc1d58a32c9p160a71jsnb77737e6bca2',
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    }
  });

  return (
    <section>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Jobs</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.JOBS}
          imgSrc={searchImage}
          placeHolder="Job Title, Company, or Keywords..."
          iconPosition="left"
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={countryFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] sm:max-w-[210px]"
        />
      </div>
      <DataRenderer
        success={!!jobs?.data}
        error={{ message: "Something went wrong" }}
        data={(jobs?.data || []) as Job[]}
        empty={EMPTY_JOBS}
        render={(jobData: Job[]) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {jobData?.map((job) => (
              <JobCard
                key={generateUniqueId()}
                job={{
                  _id: generateUniqueId(),
                  jobType: job.job_title.slice(0, 17),
                  company: job.employer_name,
                  title: job.job_title,
                  location: job.job_country,
                  type: job.job_employment_type,
                  salary: job.job_salary,
                  description: job.job_description,
                  url: job.apply_options[0].apply_link,
                }}
              />
            ))}
          </div>
        )}
      />
    </section>
  );
};

export default FindJops;
