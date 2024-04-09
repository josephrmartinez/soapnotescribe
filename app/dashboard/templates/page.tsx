import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: "Templates",
}

export default function Page() {

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${GeistSans.className} text-2xl`}>Templates</h1>
      </div>


    </div>
  )
}





// const searchResult =
  //   {
  //     "autopromptString": "Here is a company working on embryo testing innovation:",
  //     "results": [
  //         {
  //             "title": "Orchid Embryo Report: Identify your healthiest embryo",
  //             "url": "https://www.orchidhealth.com/",
  //             "publishedDate": "2000-01-01",
  //             "author": null,
  //             "id": "aYZr0UKugxRCk6PuslVx3A",
  //             "score": 0.22058936953544617
  //         },
  //         {
  //             "title": "Better TestsBetter Outcomes",
  //             "url": "https://www.lifeview.com/",
  //             "publishedDate": "2023-01-01",
  //             "author": "Simon Fishel",
  //             "id": "VQKsiSrmLFt0KztH4UAFNQ",
  //             "score": 0.21682754158973694
  //         },
  //         {
  //             "title": "Inherent Biosciences",
  //             "url": "https://www.inherentbio.com/",
  //             "publishedDate": "2023-01-01",
  //             "author": null,
  //             "id": "V4DNxsDh-Q3BYrCk-6BZfg",
  //             "score": 0.21519741415977478
  //         },
  //         {
  //             "title": "Home",
  //             "url": "https://www.emgenisys.co/",
  //             "publishedDate": "2023-01-01",
  //             "author": null,
  //             "id": "TfmpG9WYYgBmP-LMa6qiXA",
  //             "score": 0.21410804986953735
  //         },
  //         {
  //             "title": "Ravata",
  //             "url": "https://www.ravatasolutions.com/",
  //             "publishedDate": "2006-01-01",
  //             "author": null,
  //             "id": "dmXCZMVNL_jImgCxP38eTA",
  //             "score": 0.21378853917121887
  //         }
  //     ]
  // }
