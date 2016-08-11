DRAFT=draft-iab-html-rfc-bis
BRANCH := $(shell git symbolic-ref --short HEAD)
DNAME := $(shell xmllint --xpath "string(/rfc/@docName)" $(DRAFT).xml)

.PHONY: clean publish

%.txt: %.xml
	xml2rfc -N --text --html $<

%.html: %.xml
	xml2rfc -N --text --html $<

all: $(DRAFT).txt

clean:
	$(RM) $(DRAFT).html $(DRAFT).3.html $(DRAFT).3.xml $(DRAFT).n.xml $(DRAFT).txt
	@$(MAKE) -C example clean

publish: $(DRAFT).txt
	git co gh-pages
	git co $(BRANCH) -- example/xml2rfc.css
	git co $(BRANCH) -- example/test.x.xml
	git co $(BRANCH) -- example/test.n.xml
	git co $(BRANCH) -- example/test.3.xml
	git co $(BRANCH) -- example/test.3.html
	git co $(BRANCH) -- $(DRAFT).txt
	git co $(BRANCH) -- $(DRAFT).xml
	git co $(BRANCH) -- $(DRAFT).html
	git ci -m "Publish to GitHub pages"
	git push origin gh-pages
	git co $(BRANCH)

submit: $(DRAFT).txt $(DRAFT).xml
	cp $(DRAFT).txt $(DNAME).txt
	cp $(DRAFT).xml $(DNAME).xml

watch: start
	watchman-make -p '*.xml' Makefile -t $(DRAFT).txt -p 'example/**/*.xml' 'example/**/*.svg' -t example
