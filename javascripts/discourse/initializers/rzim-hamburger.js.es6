import { createWidget, applyDecorators } from "discourse/widgets/widget";
import { withPluginApi } from "discourse/lib/plugin-api";

const flatten = array => [].concat.apply([], array);

export default {
  name: "rzim-hamburger",

  initialize() {
    withPluginApi("0.8.31", api => {
      api.reopenWidget("hamburger-menu", {
        generalLinks() {
          const { attrs, currentUser, siteSettings, state } = this;
          const links = [];

          links.push({
            route: "discovery.latest",
            className: "latest-topics-link",
            label: themePrefix("latest_title"),
            title: "filters.latest.help"
          });

          if (currentUser) {
            if (false) { // hide new
              links.push({
                route: "discovery.new",
                className: "new-topics-link",
                labelCount: "filters.new.title_with_count",
                label: "filters.new.title",
                title: "filters.new.help",
                count: this.lookupCount("new")
              });
            }

            links.push({
              route: "discovery.unread",
              className: "unread-topics-link",
              labelCount: "filters.unread.title_with_count",
              label: themePrefix("unread_title"),
              title: "filters.unread.help",
              count: this.lookupCount("unread")
            });

            // add Ask My Question
            links.push({
              href: "/new-topic", 
              className: "ask-my-question-link",
              label: themePrefix("ask_title"),
              title: themePrefix("ask_help")
            });

            // add Join A Group
            links.push({
              href: "/g?type=public", 
              className: "join-a-group-link",
              label: themePrefix("join_title"),
              title: themePrefix("join_help")
            });

          } // currentUser 
          else { // anon only
            links.push({
              href: "/t/slug/2208", 
              className: "welcome-to-connect-link",
              label: themePrefix("welcome_title"),
              title: themePrefix("welcome_help")
            });
          }

          // add Community Standards
          links.push({
            href: "/tos",
            className: "tos-link",
            label: themePrefix("tos_title"),
            title: themePrefix("tos_help")
          });

          // add Give
          links.push({
            href: "https://give.rzim.org/connect",
            className: "give-link",
            label: themePrefix("give_title"),
            title: themePrefix("give_help")
          });

          // moved Review to the bottom
          if (currentUser) {
            // Staff always see the review link.
            // Non-staff will see it if there are items to review
            if (currentUser.staff || currentUser.reviewable_count) {
              links.push({
                route: siteSettings.reviewable_default_topics
                  ? "review.topics"
                  : "review",
                className: "review",
                label: "review.title",
                badgeCount: "reviewable_count",
                badgeClass: "reviewables"
              });
            }
          }
          if (false) { // hide "top" and "badges" 
            links.push({
              route: "discovery.top",
              className: "top-topics-link",
              label: "filters.top.title",
              title: "filters.top.help"
            });
            if (siteSettings.enable_badges) {
              links.push({
                route: "badges",
                className: "badge-link",
                label: "badges.title"
              });
            }
          }

          if (false) { // hide users, groups, tags
            const canSeeUserProfiles =
              currentUser || !siteSettings.hide_user_profiles_from_public;
            if (siteSettings.enable_user_directory && canSeeUserProfiles) {
              links.push({
                route: "users",
                className: "user-directory-link",
                label: "directory.title"
              });
            }
            if (siteSettings.enable_group_directory) {
              links.push({
                route: "groups",
                className: "groups-link",
                label: "groups.index.title"
              });
            }
            if (siteSettings.tagging_enabled) {
              links.push({ route: "tags", label: "tagging.tags" });
            }
          }

          const extraLinks = flatten(
            applyDecorators(this, "generalLinks", attrs, state)
          );
          return links.concat(extraLinks).map(l => this.attach("link", l));
        },
      });
    });
  }
};

