using UnityEngine;

public class DropObstacle : MonoBehaviour
{
    [SerializeField] float timeToWait = 2f;

    MeshRenderer myMeshRenderer;
    Rigidbody myRigidBody;

    void Start()
    {
        myMeshRenderer = GetComponent<MeshRenderer>();
        myRigidBody = GetComponent<Rigidbody>();

        myMeshRenderer.enabled = false;
        myRigidBody.useGravity = false;
    }

    void Update()
    {
        if (Time.time > timeToWait)
        {
            myMeshRenderer.enabled = true;
            myRigidBody.useGravity = true;
        }
    }
}
