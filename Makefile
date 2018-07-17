# the helper directory with all the touched files to check timestamps
M = .makehelper

ACTIVATE = . $(shell pwd)/admin/activate
ROOT = $(shell pwd)
ADMIN = $(ROOT)/admin

TOUCH = touch
CP = cp
YARN = yarn
JEST = yest

MKDIR = mkdir
RM = rm
MORE = more

PACKAGE_DIRS= \
   packages/moxb \
   packages/semui \
   packages/meteor \

# recursively makes all targets before the :
all test: all-dependencies
	for dir in $(PACKAGE_DIRS); do \
		echo '=======================================' $$dir '======================================='; \
		$(MAKE) -C $$dir -f Makefile $@; \
	done

help:
	@$(MORE) MakeHelp.md

clean:
	for dir in $(PACKAGE_DIRS); do \
		$(MAKE) -C $$dir clean; \
	done
	$(RM) -rf admin/activate
	$(RM) -rf admin/node-tools/node_modules
	$(RM) -rf node_modules
	$(RM) -rf admin/yarn-installation/installation/current
	$(RM) -rf admin/yarn-installation/installation/yarn-*
	$(RM) -rf .git/hooks/pre-push
	$(RM) -rf .git/hooks/pre-commit
	$(RM) -rf $(M)


admin/activate: admin/activate.in admin/bin/write-activate.sh
	admin/bin/write-activate.sh

pre-push: pre-commit

pre-commit: all-dependencies _check-for-only
	$(MAKE) run-unit-tests

_check-for-only:
	@!( grep '\.only(' `find $(PACKAGE_DIRS) -name '*.test.*'`)


# create a helper directory with files for the makefile
$(M):
	$(MKDIR) $@

.git/hooks/pre-push: hooks/pre-push
	$(CP) hooks/pre-push .git/hooks/

.git/hooks/pre-commit: hooks/pre-commit
	$(CP) hooks/pre-commit .git/hooks/

### yarn ########################################

$(M)/yarn-installation: admin/yarn-installation/.yarn-version admin/bin/install-yarn.sh
	@echo "Installing yarn..."
	@$(ACTIVATE) && admin/bin/install-yarn.sh
	@touch $@


_check-if-commands-exist:
	@admin/bin/check-if-commands-exist.sh node

###### node_module #############################

node_modules:
	$(RM) -rf $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies

# reinstall node modules when yarn version changes
$(M)/src-node_modules: $(ADMIN)/yarn-installation/.yarn-version
	$(RM) -rf node_modules $(M)/npm-dependencies
	$(MAKE) $(M)/npm-dependencies
	@$(TOUCH) $@

$(M)/npm-dependencies: package.json yarn.lock
	@echo "Installing NPM dependencies for the meteor server..."
	$(ACTIVATE) \
		&& $(YARN) --ignore-engines
	$(RM) -rf $(M)/formatted $(M)/tslinted  $(M)/tslinted-all
	@$(TOUCH) $@

###### all-dependencie #############################

all-dependencies: \
	$(M) \
	_check-if-commands-exist \
	admin/activate \
	$(M)/yarn-installation \
	node_modules \
	$(M)/src-node_modules \
	.git/hooks/pre-push \
	.git/hooks/pre-commit \


run-unit-tests: all-dependencies
	$(ACTIVATE) \
		&& jest

run-unit-tests-verbose: all-dependencies
	$(ACTIVATE) \
		&& cd src \
		&& jest --verbose

.PHONY: \
	all \
	help \
	clean \
	pre-push \
	pre-commit \
	all-dependencies \
	run-unit-tests \
	run-unit-tests-jest \
	format-code \
	tsc-clean-generated-js-files \
	tsc \
	tsc-watch \
	tslint \
	tslint-fix \
	format-file

