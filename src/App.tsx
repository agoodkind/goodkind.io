import Section from "./components/Section";
import Title from "./components/Title";
import About from "./sections/About";
import Education from "./sections/Education";
import Resume from "./sections/Resume";

const hero = {
  title: "Alex Goodkind",
};

function App() {
  return (
    <main className="container p-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5">
          <div className="shadow rounded-xl overflow-hidden">
            <div className="h-32 bg-cover"></div>
            <div className="pt-14 p-7 bg-white relative">
              <span className="status-badge bg-gray-400">Busy</span>
              <a href="/personal_cv/">
                <img
                  src="assets/img/avatar.jpg"
                  alt="Avatar"
                  className="user-photo"
                />
              </a>
              <div className="text-lg font-semibold mb-1.5">{hero.title}</div>
              <div className="text-sm text-gray-400 mb-7">Senior Developer</div>
              <div className="flex group">
                <button className="download-btn">Download CV</button>
                <button className="download-btn-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <Section>
            <Title>Information</Title>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-gray-400">Location</div>
                <div className="font-medium text-right text-gray-600">
                  London
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">Experience</div>
                <div className="font-medium text-right text-gray-600">
                  3+ years
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">Availability</div>
                <div className="font-medium text-right text-gray-600">
                  1 week
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">Relocation</div>
                <div className="font-medium text-right text-gray-600">No</div>
              </div>
            </div>
          </Section>

          <Section>
            <h2 className="block-title">Skills</h2>
            <div className="-m-2 flex flex-wrap">
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Vue</span>
              <span className="skill-tag">SQL</span>
              <span className="skill-tag">HTML/CSS</span>
              <span className="skill-tag">Java</span>
            </div>
          </Section>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <About />
          <Resume />
          <Education />
        </div>
      </div>
    </main>
  );
}

export default App;
