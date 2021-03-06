setup(name='gosomi',
      version=__version__,
      url='https://lab.hanium.or.kr/20_hg012y/main.git',
      license='Apache-2.0',
      author='HaeKyuong Jung',
      author_email='ICTPoolC@gmail.com',
      description='ICT AI Law service',
      packages=['DB','NLP', ],
      long_description=open('README.md', encoding='utf-8').read(),
      zip_safe=False,
      include_package_data=True,
      )