Gem::Specification.new do |s|
  s.name          = 'jekyll-theme-minimal'
  s.version       = '0.1.1'
  s.license       = 'CC0-1.0'
  s.authors       = ['Steve Smith', 'GitHub, Inc.']
  s.email         = ['opensource+jekyll-theme-minimal@github.com']
  s.homepage      = 'https://github.com/pages-themes/minimal'
  s.summary       = ''

  s.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^((_includes|_layouts|_sass|assets)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  s.platform = Gem::Platform::RUBY
  s.add_runtime_dependency 'github-pages'
  s.add_runtime_dependency 'jekyll-seo-tag', '~> 2.0'
  s.add_development_dependency 'html-proofer', '~> 3.0'
  s.add_development_dependency 'rubocop', '~> 0.50'
  s.add_development_dependency 'w3c_validators', '~> 1.3'
  s.add_runtime_dependency 'bootstrap-sass'
  s.add_runtime_dependency 'font-awesome-sass'
end
