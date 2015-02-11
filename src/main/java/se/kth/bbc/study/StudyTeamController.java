package se.kth.bbc.study;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.ejb.EJBException;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.ViewScoped;
import se.kth.bbc.activity.ActivityController;
import se.kth.bbc.activity.ActivityMB;
import se.kth.bbc.lims.ClientSessionState;
import se.kth.bbc.lims.MessagesController;

/**
 *
 * @author stig
 */
@ManagedBean
@ViewScoped
public class StudyTeamController {
  private static final Logger logger = Logger.getLogger(StudyTeamController.class.getName());

  private String toRemoveEmail;
  private String toRemoveName;

  @EJB
  private StudyTeamFacade teamFacade;

  @ManagedProperty(value = "#{clientSessionState}")
  private ClientSessionState sessionState;

  @ManagedProperty(value = "#{activityBean}")
  private ActivityMB activity;

  public void setToRemove(String email, String name) {
    this.toRemoveEmail = email;
    this.toRemoveName = name;
  }

  public void clearToRemove() {
    this.toRemoveEmail = null;
    this.toRemoveName = null;
  }

  public String getToRemoveEmail() {
    return toRemoveEmail;
  }

  public String getToRemoveName() {
    return toRemoveName;
  }

  public synchronized void deleteMemberFromTeam() {
    try {
      teamFacade.removeStudyTeam(sessionState.getActiveStudyname(), toRemoveEmail);
      activity.addActivity(ActivityController.REMOVED_MEMBER + toRemoveEmail,
              sessionState.getActiveStudyname(), "TEAM");
    } catch (EJBException ejb) {
      MessagesController.addErrorMessage("Deleting team member failed.");
      logger.log(Level.WARNING,"Failed to remove team member "+toRemoveEmail+"from study "+sessionState.getActiveStudyname(),ejb);
      return;
    }
    MessagesController.addInfoMessage("Member removed", "Team member " + toRemoveEmail
            + " deleted from study " + sessionState.getActiveStudyname());
    clearToRemove();
  }

  public void setSessionState(ClientSessionState sessionState) {
    this.sessionState = sessionState;
  }

  public void setActivity(ActivityMB activity) {
    this.activity = activity;
  }
}
